Ext.define('Jarvus.util.DAVClient', {
    requires: [
        'Jarvus.util.API'
    ],
    mixins: [
        'Ext.mixin.Observable'
    ],


    config: {
        /**
         * @cfg The {Ext.data.Connection} instance that will process requests
         * @required
         */
        connection: 'Jarvus.util.API',

        /**
         * @cfg Optional base URI to prepend DAV paths with
         */
        baseUri: null
    },


    /**
     * Automatically inject "connection" class into requires
     */
    onClassExtended: function(cls, data, hooks) {
        var connection = data.connection || data.config && data.config.connection,
            onBeforeClassCreated;

        if (typeof connection === 'string') {
            onBeforeClassCreated = hooks.onBeforeCreated;

            hooks.onBeforeCreated = function() {
                var me = this,
                    args = arguments;

                Ext.require(connection, function() {
                    onBeforeClassCreated.apply(me, args);
                });
            };
        }
    },

    constructor: function(config) {
        var me = this;

        me.mixins.observable.constructor.call(me, config);
    },

    /**
     * Convert "connection" class into constructor reference
     */
    applyConnection: function(connection) {
        if (typeof connection == 'string') {
            Ext.syncRequire(connection);
            connection = Ext.ClassManager.get(connection);
        }

        return connection;
    },

    applyBaseUri: function(baseUri) {
        return baseUri ? baseUri.replace(/\/*$/, '') : null;
    },

    request: function(options) {
        var url = options.url,
            baseUri = this.getBaseUri();

        if (url && baseUri) {
            options.url = baseUri + '/' + url.replace(/^\/*/, '');
        }

        return this.getConnection().request(options);
    },

    downloadFile: function(path, callback, scope) {
        return this.request({
            url: path,
            method: 'GET',
            callback: callback,
            scope: scope
        });
    },

    uploadFile: function(path, content, callback, scope) {
        return this.request({
            url: path,
            method: 'PUT',
            rawData: content,
            callback: callback,
            scope: scope
        });
    }
});