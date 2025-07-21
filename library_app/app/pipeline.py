from rest_framework_simplejwt.tokens import RefreshToken

def get_tokens(backend, user, response, *args, **kwargs):
    """
    This pipeline step is called after a social user is authenticated.
    It generates JWT tokens (access and refresh) for the user.
    """
    if user:
        refresh = RefreshToken.for_user(user)
        response['access_token'] = str(refresh.access_token)
        response['refresh_token'] = str(refresh)
    return {'user': user}