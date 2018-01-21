/* tslint:disable */
import { Controller, ValidateParam, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { BooksController } from './../controllers/booksController';
import { UsersController } from './../controllers/usersController';

const models: TsoaRoute.Models = {
    "Book": {
        "properties": {
            "name": { "dataType": "string", "required": true },
            "authorName": { "dataType": "string", "required": true },
        },
    },
    "loggedIn": {
        "properties": {
            "checkUser": { "dataType": "string", "required": true },
            "isAuthenticated": { "dataType": "boolean", "required": true },
        },
    },
};

export function RegisterRoutes(app: any) {
    app.get('/books/get/:userid',
        function(request: any, response: any, next: any) {
            const args = {
                userid: { "in": "path", "name": "userid", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new BooksController();


            const promise = controller.getBooks.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/users/isAuthenticated/:checkuser',
        function(request: any, response: any, next: any) {
            const args = {
                checkuser: { "in": "path", "name": "checkuser", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UsersController();


            const promise = controller.isAuthenticatedUser.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/users/isAuthenticated',
        function(request: any, response: any, next: any) {
            const args = {
                login: { "in": "body", "name": "login", "required": true, "ref": "loggedIn" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UsersController();


            const promise = controller.Authenticate.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });


    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                if (controllerObj instanceof Controller) {
                    const controller = controllerObj as Controller
                    const headers = controller.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        response.set(name, headers[name]);
                    });

                    statusCode = controller.getStatus();
                }

                if (data) {
                    response.status(statusCode || 200).json(data);
                } else {
                    response.status(statusCode || 204).end();
                }
            })
            .catch((error: any) => next(error));
    }

    function getValidatedArgs(args: any, request: any): any[] {
        const fieldErrors: FieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return ValidateParam(args[key], request.query[name], models, name, fieldErrors);
                case 'path':
                    return ValidateParam(args[key], request.params[name], models, name, fieldErrors);
                case 'header':
                    return ValidateParam(args[key], request.header(name), models, name, fieldErrors);
                case 'body':
                    return ValidateParam(args[key], request.body, models, name, fieldErrors, name + '.');
                case 'body-prop':
                    return ValidateParam(args[key], request.body[name], models, name, fieldErrors, 'body.');
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }
}
