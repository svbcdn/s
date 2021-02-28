(() => {
  mixpanel.init('ab2df6f7275adfaaedf72967e644304f');
  function time() {
    return moment()
      .locale('zh-CN')
      .format('YYYYMMDD HHmmss');
  }
  async function setPeople() {
    try {
      let user = await store.login(); ///.get('user').catch((err) => undefined);

      if (user && user.id) {
        let id = user.id;
        mixpanel.identify(id);
        mixpanel.people.set({
          $email: id, // only special properties need the $
          //"Sign up date": USER_SIGNUP_DATE,    // Send dates in ISO timestamp format (e.g. "2020-01-02T21:07:03Z")
          //runStart: Date.now(),
          USER_ID: id, // use human-readable names
          credits: 150, // ...or numbers
          $direct: 'https://www.lightnet.ml',
        });
      }
    } catch (err) {
      console.error('track people', err.message);
    }
  }

  async function track(eventName, data) {
    try {
      mixpanel.track(eventName, { ...data, t: time(), ua: navigator.userAgent });
    } catch (err) {
      console.error('track ', err.message);
    }
  }
  class Analytics {
    async track(eventName, data) {
      track(eventName, data);
    }
    /** 应用启动 */
    async trackStartup(data) {
      await setPeople();
      track('startup', data);
    }

    /** 应用退出 */
    async trackDropout(data) {
      track('dropout', data);
    }

    /** 登录 */
    async trackLogin(data) {
      await setPeople();
      track('login', data);
    }
    /** 退出 */
    async trackLogout(data) {
      track('logout', data);
    }
    async trackError(data) {
      track('error', data);
    }
  }

  window.analytics = new Analytics();
  window.addEventListener('analytics', (info) => {
    track(info.event, info.data);
  });
})();
