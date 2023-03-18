def build_absolute_uri(self, user):
    if user.avatar:
        request = self.context.get("request")
        return request.build_absolute_uri("/static/%s" % user.avatar.name) if request else ""