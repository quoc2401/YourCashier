from rest_framework import pagination
from rest_framework.response import Response


class Paginator(pagination.PageNumberPagination):
    page_size = 10

    def get_paginated_response(self, data):
        next_page_number = self.page.next_page_number() if self.page.has_next() else None
        prev_page_number = self.page.previous_page_number() if self.page.has_previous() else None
        return Response(
            {
                "next": next_page_number,
                "previous": prev_page_number,
                "totalRecords": self.page.paginator.count,
                "data": data,
            }
        )
