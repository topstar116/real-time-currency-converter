export default async function () {
  const openNewTab = async (url: string) => {
    await chrome.tabs.create({
      url,
    });
  };
  return { openNewTab };
}
