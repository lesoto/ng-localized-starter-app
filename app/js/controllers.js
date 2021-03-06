'use strict';

angular.module('ngLocalizedStarterApp.controllers', [])

    .controller('HomeCtrl', ['$scope', 'syncData', function ($scope, syncData) {
        syncData('syncedValue').$bind($scope, 'syncedValue');
    }])

    .controller('ContactCtrl', ['$scope', function ($scope) {
        $scope.map = {
            center: {
                latitude: 45,
                longitude: -73
            },
            zoom: 8
        };
    }])

    .controller('ChatCtrl', ['$scope', 'syncData', function ($scope, syncData) {
        $scope.newMessage = null;

        // constrain number of messages by limit into syncData
        // add the array into $scope.messages
        $scope.messages = syncData('messages', 10);

        // add new messages to the list
        $scope.addMessage = function () {
            if ($scope.newMessage) {
                $scope.messages.$add({text: $scope.newMessage});
                $scope.newMessage = null;
            }
        };
    }])

    .controller('LoginCtrl', ['$scope', 'loginService', '$location', function ($scope, loginService, $location) {
        $scope.email = null;
        $scope.pass = null;
        $scope.confirm = null;
        $scope.createMode = false;

        $scope.login = function (cb) {
            $scope.err = null;
            if (!$scope.email) {
                $scope.err = 'Please enter an email address';
            }
            else if (!$scope.pass) {
                $scope.err = 'Please enter a password';
            }
            else {
                loginService.login($scope.email, $scope.pass, function (err, user) {
                    $scope.err = err ? err + '' : null;
                    if (!err) {
                        cb && cb(user);
                    }
                });
            }
        };

        $scope.createAccount = function () {
            $scope.err = null;
            if (assertValidLoginAttempt()) {
                loginService.createAccount($scope.email, $scope.pass, function (err, user) {
                    if (err) {
                        $scope.err = err ? err + '' : null;
                    }
                    else {
                        $scope.login(function () {
                            loginService.createProfile(user.uid, user.email);
                            $location.path('/account');
                        });
                    }
                });
            }
        };

        function assertValidLoginAttempt() {
            if (!$scope.email) {
                $scope.err = 'Please enter an email address';
            }
            else if (!$scope.pass) {
                $scope.err = 'Please enter a password';
            }
            else if ($scope.pass !== $scope.confirm) {
                $scope.err = 'Passwords do not match';
            }
            return !$scope.err;
        }
    }])

    .controller('AccountCtrl', ['$scope', 'loginService', 'syncData', '$location', function ($scope, loginService, syncData, $location) {
        syncData(['users', $scope.auth.user.uid]).$bind($scope, 'user');

        $scope.logout = function () {
            loginService.logout();
        };

        $scope.oldpass = null;
        $scope.newpass = null;
        $scope.confirm = null;

        $scope.reset = function () {
            $scope.err = null;
            $scope.msg = null;
        };

        $scope.updatePassword = function () {
            $scope.reset();
            loginService.changePassword(buildPwdParms());
        };

        function buildPwdParms() {
            return {
                email: $scope.auth.user.email,
                oldpass: $scope.oldpass,
                newpass: $scope.newpass,
                confirm: $scope.confirm,
                callback: function (err) {
                    if (err) {
                        $scope.err = err;
                    }
                    else {
                        $scope.oldpass = null;
                        $scope.newpass = null;
                        $scope.confirm = null;
                        $scope.msg = 'Password updated!';
                    }
                }
            }
        }

    }])

function LanguageCtrl($scope, localize) {

    $scope.setEnglishLanguage = function () {
        localize.setLanguage('en-US');
    };

    $scope.setSpanishLanguage = function () {
        localize.setLanguage('es-US');
    };

    $scope.setRussianLanguage = function () {
        localize.setLanguage('ru-RU');
    };
}

var ImagePlaceholderCtrl = function ( $scope ) {
    $scope.imageDimension = '500x370';
};

var TextPlaceholderCtrl = function ( $scope ) {
    $scope.numSentences = "13";
    $scope.numParagraphs = "4";
    $scope.numCombined = "2p3s";
};

