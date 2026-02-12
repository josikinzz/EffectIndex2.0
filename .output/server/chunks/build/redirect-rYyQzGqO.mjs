async function redirect({ route, redirect: redirect2, store }) {
  try {
    if (!store.state.redirects.fetched) await store.dispatch("redirects/get");
    const foundRedirect = store.state.redirects.list.find((r) => r.from === route.fullPath.slice(1) || r.from + "/" === route.fullPath.slice(1));
    if (foundRedirect && route.fullPath !== "/" + foundRedirect.to) {
      redirect2("/" + foundRedirect.to);
    }
  } catch (error) {
    console.log("Redirect middleware error:");
    console.log(error);
  }
}

export { redirect as default };
//# sourceMappingURL=redirect-rYyQzGqO.mjs.map
