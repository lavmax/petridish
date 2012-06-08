var SS = window.SS || {};

SS.Database = new Class({
    
    Implements: [Options],
    
    options: {
        name: 'mysqlbase',
        description: 'My SQL base',
        size: 5 // in MB
    },
    
    database: undefined,
    
    initialize: function(options)
    {
        this.setOptions(options);
        this.database = openDatabase(this.options.name, '1.0', this.options.description, this.options.size * 1024 * 1024);
    },
    
    transaction: function(text, params, callback)
    {
        this.database.transaction(function(transaction){transaction.executeSql(text, params, callback)});
    },
    
    createTable: function(name, fields, callback)
    {
        var text = 'CREATE TABLE IF NOT EXISTS %name% (%fields%)';
        text = text.replace('%name%', name);
        
        var fieldsText = '';
        var keys = Object.keys(fields);
        for (var i = 0; i < keys.length; i++)
            fieldsText += keys[i] + ' ' + fields[keys[i]] + ',';
        fieldsText = fieldsText.substring(0, fieldsText.length - 1);
        text = text.replace('%fields%', fieldsText);
        
        this.transaction(text, [], function(transaction, result){
            this.tables[name] = new SS.DatabaseTable({name: name, database: this});
        }.bind(this));
    },
    
});

SS.DatabaseTable = new Class({
    
    Implements: [Options],
    
    name: '',
    database: undefined,
    
    initialize: function(name, database)
    {
        this.name = name;
        this.database = database;
    },
    
    insert: function(rows)
    {
        this.database.transaction('INSERT INTO %name% (fields) VALUES (%values%)'); // ???
    }
});