jQuery(function($) {
	Ajax = {
		get: function(url, data, callback) {
            return this._ajax("GET", url, data, callback);
        },
        post: function(url, data, callback) {
            return this._ajax("POST", url, data, callback);
        },
        put: function(url, data, callback) {
            return this._ajax("PUT", url, data, callback);
        },
        //本来叫做delete，但是ie下面这个名称不能使用
        del: function(url, callback) {
            var self = this,
                params = {
                    type: 'DELETE',
                    url: url,
                    dataType: "json",
                    success: function(data) {
                        if (callback!=null) {
                            callback.call(this, data);
                        }
                    }
                }

            $.ajax(params);

        },
        _ajax: function(type, url, data, callback) {
            var self = this;
            var params = {
                type: type,
                url: url,
                data: data,
                dataType: "text",
                success: function(response, status, xhr) {
                    if (callback!=null) {
                        callback.call(this, response, xhr);
                    }
                }
            };
            return $.ajax(params);

        }

	}
})
