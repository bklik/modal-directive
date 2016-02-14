/***********************************************************************
Modal Directive
Author: Brenton Klik

Prerequisites:
 - AngularJS
 - styleSheetFactory (https://github.com/bklik/styleSheetFactory)

Description:
Create a modal that overlays the webpage, and positions a panel to the
center of the screen.
/**********************************************************************/
angular.module('modal-directive', ['style-sheet-factory'])

.directive('modal', ['styleSheetFactory', function(styleSheetFactory) {
    return {
        scope: {
            api: '=',
            hideCallback: '&'
        },
        restrict: 'E',
        transclude: true,
        template: '<ng-transclude class="modal-panel"></ng-transclude>',
        link: function($scope, $element, $attrs) {
            /************************************************************************
            API
            ************************************************************************/
            $scope.api = {
                show: function(event) {
                    show(event);
                },

                hide: function() {
                    hide();
                },
            };

            /************************************************************************
            Variables
            ************************************************************************/
            // The document's stylesheet.
            var styleSheet = styleSheetFactory.getStyleSheet();

            // The prefix used by the browser for non-standard properties.
            var prefix = styleSheetFactory.getPrefix();

            // Target element the popup should appear next to.
            var target = null;

            // Length of the animations for show and hide.
            var animationDuration = 350;

            /************************************************************************
            Methods
            ************************************************************************/
            // Display the modal
            var show = function(event) {
                target = event.target;

                var targetRect = target.getBoundingClientRect();
                var panelRect = panel.getBoundingClientRect();

                var translateX = (targetRect.left - panelRect.left) + (targetRect.width / 2);
                var translateY = (targetRect.top - panelRect.top) + (targetRect.height / 2);

                styleSheetFactory.removeCSSKeyframes(styleSheet, 'hide-modal-panel');
                styleSheetFactory.addCSSKeyframes(styleSheet, 'show-modal-panel',
                    '0% {'+
                        prefix+'transform: translate('+translateX+'px, '+translateY+'px) scale(0, 0);' +
                        'transform: translate('+translateX+'px, '+translateY+'px) scale(0, 0);' +
                        'visibility: hidden;' +
                    '}' +
                    '100% {' +
                        prefix+'transform: translate(0, 0) scale(1, 1);' +
                        'transform: translate(0, 0) scale(1, 1);' +
                        'visibility: visible;' +
                    '}'
                );

                // Give show-modal-panel time to register on slower devices
                setTimeout(function() {
                    $element.removeClass('hide');
                    $element.addClass('show');
                },50);
            };

            // Hide the modal
            var hide = function() {
                var targetRect = target.getBoundingClientRect();
                var panelRect = panel.getBoundingClientRect();

                var translateX = (targetRect.left - panelRect.left) + (targetRect.width / 2);
                var translateY = (targetRect.top - panelRect.top) + (targetRect.height / 2);

                styleSheetFactory.removeCSSKeyframes(styleSheet, 'show-modal-panel');
                styleSheetFactory.addCSSKeyframes(styleSheet, 'hide-modal-panel',
                    '0% {'+
                        prefix+'transform: translate(0, 0) scale(1, 1);' +
                        'transform: translate(0, 0) scale(1, 1);' +
                        'visibility: visible;' +
                    '}' +
                    '100% {' +
                        prefix+'transform: translate('+translateX+'px, '+translateY+'px) scale(0, 0);' +
                        'transform: translate('+translateX+'px, '+translateY+'px) scale(0, 0);' +
                        'visibility: hidden;' +
                    '}'
                );

                // Give show-modal-panel time to register on slower devices
                setTimeout(function() {
                    $element.removeClass('show');
                    $element.addClass('hide');
                },50);
            }

            /************************************************************************
            Init
            ************************************************************************/
            var panel = $element.find('ng-transclude')[0];

            /************************************************************************
            Styles

            SCSS Template:
            modal {
                &.show {
                    .modal-panel {}
                }
                &.hide {
                    .modal-panel {}
                }
                .modal-panel {}
            }
            ************************************************************************/
            // Add this directive's styles to the document's stylesheet.
            styleSheetFactory.addCSSRule(styleSheet, 'modal',
                prefix+'align-items: center;' +
                'align-items: center;' +
                'background: rgba(0,0,0,0.75);' +
                'content: "";' +
                'display: webkit-flex;' +
                'display: flex;' +
                prefix+'justify-content: center;' +
                'justify-content: center;' +
                'overflow: hidden;' +
                'visibility: hidden;' +
                'pointer-events: none;' +
                'position: fixed;' +
                'top: 0;' +
                'right: 0;' +
                'bottom: 0;' +
                'left: 0;' +
                'z-index: 10;'
            );

            styleSheetFactory.addCSSKeyframes(styleSheet, 'show-modal',
                '0% {'+
                    'visibility: hidden;' +
                    'opacity: 0;' +
                '}' +
                '100% {' +
                    'visibility: visible;' +
                    'opacity: 1;' +
                '}'
            );

            styleSheetFactory.addCSSKeyframes(styleSheet, 'hide-modal',
                '0% {'+
                    'visibility: visible;' +
                    'opacity: 1;' +
                '}' +
                '100% {' +
                    'visibility: hidden;' +
                    'opacity: 0;' +
                '}'
            );

            styleSheetFactory.addCSSRule(styleSheet, 'modal.show',
                'pointer-events: auto;' +
                prefix+'animation: show-modal '+animationDuration+'ms forwards;' +
                'animation: show-modal '+animationDuration+'ms forwards;'
            );

            styleSheetFactory.addCSSRule(styleSheet, 'modal.hide',
                prefix+'animation: hide-modal '+animationDuration+'ms forwards;' +
                'animation: hide-modal '+animationDuration+'ms forwards;'
            );

            styleSheetFactory.addCSSRule(styleSheet, 'modal .modal-panel',
                'background: white;' +
                'border-radius: 2px;' +
                'box-shadow: 0 3px 3px rgba(0,0,0,0.25);' +
                'display: inline-block;' +
                prefix+'transform-origin: top left;' +
                'transform-origin: top left;'
            );

            styleSheetFactory.addCSSRule(styleSheet, 'modal.show .modal-panel',
                prefix+'animation: show-modal-panel '+animationDuration+'ms forwards;' +
                'animation: show-modal-panel '+animationDuration+'ms forwards;'
            );

            styleSheetFactory.addCSSRule(styleSheet, 'modal.hide .modal-panel',
                prefix+'animation: hide-modal-panel '+animationDuration+'ms ;' +
                'animation: hide-modal-panel '+animationDuration+'ms ;'
            );
        }
    }
}]);
