/**
 * indexBD数据库
 * @author guotingjie@maxthon.net
 * @ctime 2017-12-29
 */
'use strict';
define('static/js/indexdb', function (require, exports, module) {
    var db;

    function createDatabase(indexDbName) {
        //调用 open 方法并传递数据库名称。如果不存在具有指定名称的数据库，则会创建该数据库
        var openRequest = indexedDB.open(indexDbName); var db;
        openRequest.onerror = function (e) {//当创建数据库失败时候的回调
            console.log("Database error: " + e.target.errorCode);
        };
        openRequest.onsuccess = function (event) {
            console.log("Database created");
            db = openRequest.result;//创建数据库成功时候，将结果给db，此时db就是当前数据库
            //alert("this is :"+db);
        };
        openRequest.onupgradeneeded = function (evt) {//更改数据库，或者存储对象时候在这里处理
        };
    }

    function deleteDatabase(indexDbName) {
        var deleteDbRequest = indexedDB.deleteDatabase(indexDbName);
        deleteDbRequest.onsuccess = function (event) {
            console.log("detete database success");
        };
        deleteDbRequest.onerror = function (e) {
            console.log("Database error: " + e.target.errorCode);
        };
    }

    function insertAnObj(indexDbName) {
        var staticServer = '';
        var userinfos = DEFAULT_MY_SITE;
        var openRequest = indexedDB.open(indexDbName, 1);
        openRequest.onerror = function (e) {//当创建数据库失败时候的回调
            console.log("Database error: " + e.target.errorCode);
        };
        openRequest.onsuccess = function (event) {
            db = openRequest.result; //创建数据库成功时候，将结果给db，此时db就是当前数据库
            //打开和userinfo相关的objectstore的事物
            var transaction = db.transaction("userinfo", 'readwrite');
            var store = transaction.objectStore("userinfo");
            for (var i = 0; i < userinfos.length; i++) {
                store.add(userinfos[i]);//将对象添加至userinfo相关的objectstore中
            }
        };
        openRequest.onupgradeneeded = function (event) {
            db = event.target.result;
            //在第一次创建数据库的时候，就创建userinfo相关的objectstore，以供后面添加数据时候使用
            if (!db.objectStoreNames.contains('userinfo')) {
                //keyPath:Javascript对象，对象必须有一属性作为键值
                db.createObjectStore('userinfo', { keyPath: "id", autoIncrement: true });
            }
        }
    }

    function findAllDbdata(indexDbName) {
        var openRequest = indexedDB.open(indexDbName);
        var db;
        openRequest.onsuccess = function (event) {
            console.log("Database created");
            db = openRequest.result; //创建数据库成功时候，将结果给db，此时db就是当前数据库
            var transaction = db.transaction("userinfo", 'readonly');
            var objectStore = transaction.objectStore("userinfo");
            var cursor = objectStore.openCursor();
            cursor.onsuccess = function (e) {
                var res = e.target.result;
                if (res) {
                    // console.log("Key", res.key);
                    var request = objectStore.get(Number(res.key));//根据查找出来的id，再次逐个查找
                    request.onsuccess = function (e) {
                        var res = e.target.result; //查找成功时候返回的结果对象
                        console.log(res);
                        // if (res) {
                        //     for (var field in res) { //遍历每一个对象属性
                        //         if(res[field] instanceof Array) {
                        //             for(var childrenfield in res[field]) {
                        //                 console.log(res[field][childrenfield]);
                        //             }
                        //         } else {
                        //             console.log(field + ":" + res[field]);
                        //         }
                        //     };
                        // };
                    }
                    res.continue();
                }
            }
        };
    }

    function deleteAllData(indexDbName) {
        var openRequest = indexedDB.open(indexDbName);
        var db;
        openRequest.onsuccess = function (event) {
            db = openRequest.result; //创建数据库成功时候，将结果给db，此时db就是当前数据库
            var transaction = db.transaction("userinfo", 'readwrite');
            var objectStore = transaction.objectStore("userinfo");
            objectStore.clear();
        }
    }

    // deleteDatabase('test');
    // deleteDatabase('testDB');
    // insertAnObj('testDB');
    // findAllDbdata('testDB');

    module.exports = {
        currentDB: db,
        createDatabase: createDatabase,
        deleteDatabase: deleteDatabase,
        insertAnObj: insertAnObj,
        findAllDbdata: findAllDbdata,
        deleteAllData: deleteAllData
    }
});

