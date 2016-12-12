angular.module('sntApp')
    .config(function ($stateProvider, $urlRouterProvider, ACCESS_LEVELS, USER_ROLES) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('login', { // 登录
                url: '/login',
                data: {
                    authorizedRoles: ['login', '1', '2', '3']
                },
                templateUrl: 'pages/login.html',
                controller: 'LoginCtrl'
            })

            .state('forget', { // 修改密码
                url: '/forget',
                data: {
                    authorizedRoles: ['1', '2', '3']
                },
                views: {
                    '': {
                        templateUrl: 'pages/forget.html',
                        css: 'style/forget.css',
                        controller: function ($scope, $state, $rootScope) {
                            $scope.toLogin = function () {
                                $state.go('login');
                            }
                        }
                    }
                }
            })
            .state('index', { // 区域视图列表
                url: '/index',
                data: {
                    authorizedRoles: ['1', '2', '3']
                },
                views: {
                    '': {
                        templateUrl: 'pages/index.html'
                        // controller: 'RegionalCtrl'
                    },
                    'topbar@index': {
                        templateUrl: 'pages/topNav.html',
                        css: 'style/topNav.css',
                        controller: 'topNavCtrl'
                    },
                    'main@index': {
                        templateUrl: 'pages/regional-view/regional.html',
                        controller: 'RegionalCtrl'
                    }
                }
            })
            .state('index.modify', { // todo 批量配置区域，第一期屏蔽
                url: '/bultModify',
                views: {
                    'main@index': {
                        templateUrl: 'pages/regional-view/bult-modify.html'
                    }
                }
            })
        /**
         * 用户管理
         */
            .state('index.user', {
                url: '/user',
                data: {
                    authorizedRoles: ['2', '3']
                },
                views: {
                    'main@index': {
                        templateUrl: 'pages/user/user-admin.html',
                        controller: 'UserCtrl'
                    }
                }
            })

            .state('index.detail', { // 区域详情
                url: '/detail?regionId&gatewayId&regionAddr&regionSwitch&regionName&regionSensorData',
                data: {
                    authorizedRoles: ['1', '2', '3']
                },
                css: 'style/topNav.css',
                views: {
                    'main@index': {
                        templateUrl: 'pages/regional-view/region-detail.html',
                        controller: 'RegionalDetailCtrl'
                    },
                    'regionDetaiTabs@index.detail': {
                        templateUrl: 'pages/regional-view/regional-detail-tabs.html',
                        controller: ''
                    },
                    'detail@index.detail': {
                        templateUrl : 'pages/regional-view/regional-detail-chart.html',
                        controller : 'RegionDetailChart'
                    },
                    'control@index.detail': {
                        templateUrl : 'pages/regional-view/regional-detail-control.html'
                    },
                    'recipe@index.detail': {
                        templateUrl : 'pages/regional-view/regional-detail-recipe.html',
                        controller : 'RegionalDetailRecipeCtrl'
                    }
                }
            })
        /**
         * 高级配置
         */
            .state('index.config', { // 配置区域列表
                url: '/config',
                data: {
                    authorizedRoles: ['2', '3']
                },
                views: {
                    'main@index': {
                        templateUrl: 'pages/config/regional-config.html',
                        controller: 'regionalConfCtrl'
                    },
                    'setNav@index.config': {
                        templateUrl: 'pages/setNav.html',
                        controller: function ($scope, $state) {
                            $scope.navs = [
                                {
                                    title: 'Regional Setting',
                                    className: 'active',
                                    url: 'index.config'
                                },
                                {
                                    title: 'Gateway Setting',
                                    className: '',
                                    url: 'index.config.gateway'
                                },
                                {
                                    title: 'Recipe Setting',
                                    className: '',
                                    url: 'index.config.recipe'
                                }
                            ];
                            $scope.navs.forEach(function (element) {
                                if ($state.current.name.indexOf(element.url) !== -1) {
                                    element.className = 'active';
                                    if (element != $scope.navs[0]) $scope.navs[0].className = '';
                                }
                            }, this);

                            $scope.changeClass = function (element) {
                                element.nav.className = 'active';
                                angular.forEach($scope.navs, function (nav) {
                                    if (nav.title != element.nav.title) {
                                        nav.className = '';
                                    }
                                })
                            };
                        }
                    }
                }
            })

            // .state('index.config.regional', {
            //     url: '/regional?ToRegionSetRegionGuid&ToRegionSetRegionAddr&ToRegionSetRegionName&ToRegionSetGatewayId',
            //     data: {
            //         authorizedRoles: ['2', '3']
            //     },
            //     //高级配置详情页Tab
            //     views: {
            //         'main@index': {
            //             templateUrl: 'pages/config/regional-setting.html',
            //             controller: 'RegionalDetailCtrl'
            //         },
            //         'regionConfTabs@index.config.regional': {
            //             templateUrl: 'pages/config/conf-tabs.html',
            //             controller: ''
            //         },
            //         'conf-region@index.config.regional': {
            //             templateUrl: 'pages/config/regional-set.html',
            //             controller: 'RegionConfigDetailCtrl'
            //         },
            //         'conf-group@index.config.regional': {
            //             templateUrl: 'pages/config/regional-group.html',
            //             controller: 'GroupConfigCtrl'
            //         },
            //         'conf-scene@index.config.regional': {
            //             templateUrl: 'pages/config/scene-setting.html',
            //             controller: 'ConfigSceneCtrl'
            //         },
            //         'conf-term@index.config.regional': {
            //             templateUrl: 'pages/config/term-setting.html',
            //             controller: 'ConfigTermCtrl'
            //         },
            //         'conf-recipe@index.config.regional': {
            //             templateUrl: 'pages/config/regional-recipe.html',
            //             controller: 'ConfigRegionalRecipeCtrl'
            //         }
            //     }
            // })

            .state('index.config.group.new', { // 添加组
                url: '/new',
                views: {
                    'main@index': {
                        templateUrl: 'pages/config/new-group.html',
                        controller: 'ConfigNewGroupCtrl'
                    }
                }
            })
            .state('index.config.gateway', { // todo 目前只显示网关列表
                url: '/gateway',
                data: {
                    authorizedRoles: ['2', '3']
                },
                views: {
                    'confMain@index.config': {
                        templateUrl: 'pages/config/gateway-setting.html',
                        controller: 'GatewayConfigCtrl'
                    }
                }
            })
            //配方页面
            .state('index.config.recipe', {
                url: '/recipe',
                data: {
                    authorizedRoles: ['2', '3']
                },
                views: {
                    'confMain@index.config': {
                        templateUrl: 'pages/config/recipe-setting.html',
                        controller: 'RecipeConfigCtrl'
                    }
                }
            })
            // .state('index.config.gateway.detail', { // todo 网关详情，未开发
            //     url: '/gateway',
            //     views: {
            //         'main@index': {
            //             templateUrl: 'pages/config/gateway-detail.html',
            //             css: 'style/gateway-detail.css'
            //         }
            //     }
            // })
            .state('index.config.term', { // 条件控制列表
                url: '/term',
                data: {
                    authorizedRoles: ['2', '3']
                },
                views: {
                    'confMain@index.config': {
                        templateUrl: 'pages/config/term-setting.html',
                        controller: 'ConfigTermCtrl'
                    }
                }
            })
            .state('index.config.scene', { // 场景列表
                url: '/scene',
                data: {
                    authorizedRoles: ['2', '3']
                },
                views: {
                    'confMain@index.config': {
                        templateUrl: 'pages/config/scene-setting.html',
                        controller: 'ConfigSceneCtrl'
                    }
                }
            })
    });