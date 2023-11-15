class BackendException(Exception):
    status_code = 422

    def __init__(self, message, status_code=None, payload=None):
        super().__init__()
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        converted = dict(self.payload or ())
        converted["message"] = self.message
        return converted
