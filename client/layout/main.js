Template['layout_main'].helpers({
    isActive: (name) => Router.current().route.getName() == name ? 'active' : ''
})
