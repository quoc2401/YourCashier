from rest_framework import status
from rest_framework.response import Response
from django.core.mail import send_mail
from datetime import datetime
from django.db.models import Sum
from expense.models import Expense, ExpenseWarning, WarningLevel
from expense.serializers import CreateExpenseSerializer
from income.models import Income


class ExpenseService:
    def create(request):
        u = request.user
        serializer = CreateExpenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data["user"] = u
            expense = serializer.save()

            # Check and mail here
            warn = ExpenseWarning.objects.get(user=u)
            warn_level = WarningLevel.__members__.get(warn.warn_level)
            if warn_level == WarningLevel.WARN_SIMPLE:
                from_date = datetime.now().replace(day=1, hour=0)
                to_date = datetime.now()

                try:
                    total_income = Income.objects.filter(
                        created_date__range=[from_date, to_date], user_id=u.id, is_active=True, group_income=None
                    ).aggregate(total=Sum("amount"))["total"]

                    total_expense = Expense.objects.filter(
                        created_date__range=[from_date, to_date], user_id=u.id, is_active=True, group_expense=None
                    ).aggregate(total=Sum("amount"))["total"]

                    if not total_income:
                        total_income = 0
                    if not total_expense:
                        total_expense = 0
                    total_difference = total_income - total_expense

                    if total_difference < 0:
                        subject = "Expenses Warning!!"
                        message = """
                        Hi {0},

                        This is an email to inform with you that your we have found out that your expenses have exceeded the income you earned this month.
                        
                        The expense that caused the exceeding is Expense {1}:
                            With description: {2}
                            Money amount: ₫{3} 
                        """.format(
                            u.first_name, expense.id, expense.description, expense.amount
                        )
                        from_email = "1951052167quoc@ou.edu.vn"
                        recipient_list = [u.email]
                        send_mail(subject, message, from_email, recipient_list, fail_silently=False)
                except Exception as e:
                    print(e)
                
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        return Response(data=serializer.error_messages, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
