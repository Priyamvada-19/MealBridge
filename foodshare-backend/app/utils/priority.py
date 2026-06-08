from datetime import datetime


def calculate_priority(expiry_time):

    hours_left = (
        expiry_time - datetime.utcnow()
    ).total_seconds() / 3600

    if hours_left <= 6:
        return 100

    elif hours_left <= 12:
        return 80

    elif hours_left <= 24:
        return 60

    elif hours_left <= 48:
        return 40

    else:
        return 20