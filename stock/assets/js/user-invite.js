﻿$(function () {
    //var store = $.AMUI.store;
    //if (!store.enabled) {
    //    alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
    //    return;
    //}
    //var token = localStorage.token, uid = localStorage.uid;
    //if (!token || !uid) {
    //    window.location.href = "login.html";
    //}
    //$('#my-modal-loading').modal('open');
    //$.post('/',
    //  { token: token, uid: uid },
    //  function (data, textStatus) {
    //      $('#my-modal-loading').modal('close');
    //      if (textStatus == "success") {
    //            inviteVM.friendsCount(data.friendsCount);
    //      } else {
    //          window.location.href = "login.html";
    //      }
    //  });
    var inviteVM = {
        friendsCount: ko.observable(0),
        redirectCardClick: function () {
            window.location.href = "user_quan.html";
        },
        wechatClick: function () {

        },
        qqClick: function () {

        },
        weiboClick: function () {

        },
        copyClick: function () {

        }
    }
    ko.applyBindings(inviteVM, $("#invite-container")[0]);
})

