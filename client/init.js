Meteor.Spinner.options = {
    lines: 10, // The number of lines to draw
    length: 0, // The length of each line
    width: 4, // The line thickness
    radius: 20, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#28b8fb', // #rgb or #rrggbb or array of colors
    speed: 1.7, // Rounds per second
    trail: 49, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 0, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '90%' // Left position relative to parent
};


Router.configure({
    layoutTemplate: 'layout_main'
});

Router.route('/', function () {
    Router.go('/portfolio');
});

Router.route('/portfolio', function () {
    this.render('views_portfolio');
});

Router.route('/market', function () {
    this.render('views_market');
});

Router.route('/receivable', function () {
    this.render('views_receivable');
});

Router.route('/payable', function () {
    this.render('views_payable');
});

window.onunhandledrejection = function(e) {
    return false;
}
