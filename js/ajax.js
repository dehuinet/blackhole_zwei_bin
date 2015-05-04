jQuery(function($) {
	Ajax = {
		get: function(url, data, callback,fail) {
            return this._ajax("GET", url, data, callback,fail);
        },
        post: function(url, data, callback,fail) {
            return this._ajax("POST", url, data, callback,fail);
        },
        put: function(url, data, callback,fail) {
            return this._ajax("PUT", url, data, callback,fail);
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
        _ajax: function(type, url, data, callback,fail) {
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
                },
                error: function(response, status, thrownError,ss) {
                    
                    if (fail!=null) {
                        fail.call(this, response, thrownError);
                    }
                }
                
            };
            return $.ajax(params);

        }
        

	}
})
