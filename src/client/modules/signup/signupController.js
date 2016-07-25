import { sendReg } from './sendRegService';

export class SignupCtrl{
    constructor($scope, sendReg){
        $scope.maxname = 15;
        $scope.minname = 5;
        $scope.maxpassword = 12;
        $scope.minpassword = 6;
        $scope.maxage = 100;
        $scope.minage = 18;

        $scope.user = {
            name: "",
            age: "",
            email: "",
            password: ""
        };

        $scope.register = (user) => {
            let userInfo = {
                userName: user.name,
                userAge: user.age,
                userEmail: user.email,
                userPassword: user.password
            };
            sendReg.add(userInfo);
        };
    }
} 
