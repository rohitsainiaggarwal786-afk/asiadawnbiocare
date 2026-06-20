/* =========================================================================
   ADBC BMS — BACKGROUND GPS TRACKING (Capacitor native layer)
   Capacitor APK ke andar: browser ke watchPosition ki jagah NATIVE background
   tracker use hota hai. App band / screen off ho — tab bhi location sync.php
   par jati rahegi. Normal browser me ye file kuch nahi karti.
   ========================================================================= */
(function () {
  var isNative = !!(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform());
  if (!isNative) return;

  var BG = Capacitor.registerPlugin('BackgroundGeolocation');
  var watcherId = null;

  async function pushLocation(loc) {
    try {
      var userName = (typeof LOGGED_AGENT !== 'undefined' && LOGGED_AGENT && LOGGED_AGENT.nm)
        || (typeof LOGGED_MANAGER !== 'undefined' && LOGGED_MANAGER && LOGGED_MANAGER.nm) || 'Admin';
      var di = (typeof _getDeviceInfo === 'function') ? _getDeviceInfo() : { device: 'Android', browser: '-' };
      var now = new Date();
      var payload = {
        name: userName,
        role: (typeof ROLE !== 'undefined' ? ROLE : 'agent'),
        lat: Number(loc.latitude).toFixed(6),
        lng: Number(loc.longitude).toFixed(6),
        accuracy: Math.round(loc.accuracy || 0),
        device: di.device,
        browser: di.browser,
        time: now.toLocaleTimeString('en-IN'),
        date: now.toLocaleDateString('en-IN'),
        ts: now.getTime(),
        online: true
      };

      if (!window._liveLocations) window._liveLocations = {};
      window._liveLocations[userName] = payload;

      await fetch(SERVER_URL + '?action=gps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-crm-secret': SERVER_SECRET },
        body: JSON.stringify(payload),
        keepalive: true
      });

      var el = document.getElementById('gpsStatusDot');
      var txt = document.getElementById('gpsStatusTxt');
      if (el) { el.style.background = '#1D9E75'; el.title = 'GPS: ' + payload.lat + ', ' + payload.lng; }
      if (txt) txt.textContent = '📍 Live';
    } catch (e) {}
  }

  window.startGpsTracking = async function () {
    try {
      if (watcherId) return;
      watcherId = await BG.addWatcher(
        {
          backgroundMessage: 'Field tracking active — Asia Dawn Bio Care',
          backgroundTitle: '📍 ADBC BMS Location On',
          requestPermissions: true,
          stale: false,
          distanceFilter: 25
        },
        function (location, error) {
          if (error) {
            var el = document.getElementById('gpsStatusDot');
            if (el) { el.style.background = '#E24B4A'; el.title = 'GPS: permission/denied'; }
            if (error.code === 'NOT_AUTHORIZED') { BG.openSettings(); }
            return;
          }
          if (location) pushLocation(location);
        }
      );
    } catch (e) { console.warn('BG tracking start fail', e); }
  };

  window.stopGpsTracking = async function () {
    try {
      if (watcherId) { await BG.removeWatcher({ id: watcherId }); watcherId = null; }
    } catch (e) {}
  };
})();
