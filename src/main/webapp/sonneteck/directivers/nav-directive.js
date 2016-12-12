angular.module('sntApp').directive('navul', function (){
    return {
        restrict: "EA",
        replace: true,
        transclude: true,
        template: '<ul class="nav navbar-nav" ng-transclude></ul>',
        controller: function(){
            var expanders = [];
            this.getOpened = function(selectedExpander) {
                angular.forEach(expanders, function(expander){
                    if(selectedExpander != expander){
                        expander.nav.className = '';
                    }
                })  
            }
            this.addExpander = function(expander) {
                expanders.push(expander);
            }
        },
        link: function() {
            // log('navul')
        }
    }
})
angular.module('sntApp').directive('navli', function() {
    return {
        restrict: "EA",
        replace: true,
        transclude: true,
        require: '^?navul',
        template: '<li ng-class="nav.class">'
             + '<a ng-click="toggle()" ui-sref="{{nav.url}}" ng-transclude></a>'
             + '</li>',
        link: function(scope, element, attrs, ctrl){
            ctrl.addExpander(scope);
            scope.toggle = function toggle() {
                scope.nav.className = 'active';
                ctrl.getOpened(scope);
            }
        }
    }
})

/* 复制指令嵌套 */

// angular.module('sntApp').directive('accordion', function() {
//     return {
//         restrict: "EA",
//         replace: true,
//         transclude: true,
//         template: '<div ng-transclude></div>',
//         controller: function(){
//             var expanders = [];
//             this.getOpened = function(selectedExpander) {
//                 angular.forEach(expanders, function(expander){
//                     if(selectedExpander != expander){
//                         expander.showMe = false;
//                     }
//                 })
//             }
//             this.addExpander = function(expander) {
//                 expanders.push(expander);
//             }
//         },
//         link: function() {
//             log('accordionLink')
//         }
//     }
// })

// angular.module('sntApp').directive('expander', function() {
//     return {
//         restrict: "EA",
//         replace: true,
//         transclude: true,
//         require: '^?accordion',
//         scope: {
//             title: '=expandertitle'
//         },
//         template: '<div>'
//                 + '<div class="title" ng-click="toggle()">{{title}}</div>'
//                 + '<div class="body" ng-show="showMe" ng-transclude></div>'
//                 + '</div>',
//         link: function(scope, element, attrs, ctrl){
//             scope.showMe = false;
//             ctrl.addExpander(scope);
//             log(scope)
//             scope.toggle = function toggle() {
//                 scope.showMe = !scope.showMe;
//                 ctrl.getOpened(scope);
//             }
//         }
//     }
// })