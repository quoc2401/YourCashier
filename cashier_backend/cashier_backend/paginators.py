from rest_framework import pagination


class Paginator(pagination.PageNumberPagination):
    page_size = 10
