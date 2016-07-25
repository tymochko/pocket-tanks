import { toastr } from 'angular-toastr';

export class sendReg {
    constructor($http, $location, toastr) {
        this.add = function (userInfo) {
            return $http.post('/api/users/add', userInfo).then(() => {
                toastr.success('You registered successfully \n and can now log in.', 'Congratulations!', {
                    closeButton: true,
                    closeHtml: '<button>&times;</button>'
                })
                $location.path('/');
            }, () => {
                toastr.warning('Your username or e-mail address \n is taken. Please choose another one.', 'Oops!', {
                    closeButton: true,
                    closeHtml: '<button>&times;</button>'
                })
            });
        };
    }
}
