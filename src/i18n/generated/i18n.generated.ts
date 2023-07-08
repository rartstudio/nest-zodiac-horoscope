/* DO NOT EDIT, file generated by nestjs-i18n */

import { Path } from "nestjs-i18n";
export type I18nTranslations = {
    "http": {
        "notFound": string;
        "forbidden": string;
        "unauthorized": string;
        "unprocessableContent": string;
        "conflict": string;
        "badRequest": string;
        "internalServerError": string;
    };
    "response": {
        "auth": {
            "route": {
                "verifyResetPassword": {
                    "success": string;
                    "error": {
                        "global": string;
                    };
                };
                "resetPassword": {
                    "success": string;
                };
                "refreshToken": {
                    "success": string;
                };
                "register": {
                    "success": string;
                    "error": {
                        "username": string;
                        "email": string;
                    };
                };
                "otp": {
                    "success": {
                        "get": string;
                        "post": string;
                    };
                    "error": {
                        "otp": string;
                    };
                };
                "login": {
                    "success": string;
                    "error": {
                        "username": string;
                    };
                };
                "forgotPassword": {
                    "success": string;
                    "error": {
                        "email": string;
                    };
                };
            };
        };
        "posts": {
            "guard": {
                "exist": string;
            };
            "route": {
                "all": {
                    "success": {
                        "get": string;
                        "post": string;
                    };
                };
                "detail": {
                    "success": {
                        "get": string;
                    };
                };
            };
        };
        "user": {
            "guard": {
                "exist": string;
                "userPostExist": string;
                "userPostCommentExist": string;
                "userPostLikeUnique": string;
            };
            "route": {
                "posts": {
                    "success": {
                        "get": string;
                    };
                };
                "postsLike": {
                    "success": string;
                };
                "postsDislike": {
                    "success": string;
                };
                "postsComments": {
                    "success": string;
                };
                "postsCommentsDetail": {
                    "success": {
                        "delete": string;
                    };
                };
                "email": {
                    "success": string;
                    "error": {
                        "otp": string;
                        "email": string;
                    };
                };
                "password": {
                    "success": string;
                    "error": {
                        "currentPassword": string;
                    };
                };
                "attachment": {
                    "success": string;
                };
                "changeEmailOtp": {
                    "success": string;
                    "error": {
                        "email": string;
                    };
                };
                "me": {
                    "success": string;
                };
                "profile": {
                    "success": string;
                };
            };
        };
    };
    "validation": {
        "email": {
            "isNotEmpty": string;
            "isEmail": string;
            "maxLength": string;
        };
        "username": {
            "isString": string;
            "isNotEmpty": string;
            "maxLength": string;
        };
        "name": {
            "isNotEmpty": string;
            "maxLength": string;
        };
        "password": {
            "matches": string;
            "minLength": string;
            "maxLength": string;
            "isNotEmpty": string;
        };
        "countyCode": {
            "isNotEmpty": string;
        };
        "phoneNumber": {
            "isNotEmpty": string;
            "maxLength": string;
        };
        "passwordConfirm": {
            "match": string;
        };
        "token": {
            "isNotEmpty": string;
        };
        "userId": {
            "isNotEmpty": string;
        };
        "otp": {
            "isNotEmpty": string;
            "minLength": string;
        };
    };
};
export type I18nPath = Path<I18nTranslations>;