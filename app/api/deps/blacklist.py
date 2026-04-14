# Simple in-memory blacklist (can be replaced with Redis later)
TOKEN_BLACKLIST = set()

def blacklist_token(token: str):
    TOKEN_BLACKLIST.add(token)

def is_token_blacklisted(token: str) -> bool:
    return token in TOKEN_BLACKLIST
