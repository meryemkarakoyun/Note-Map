import { defaultIcon, visitIcon, homeIcon, jobIcon, parkIcon } from "./ui.js";

export function getNoteIcon(status) {
  switch (status) {
    case "visit":
      return visitIcon;
    case "home":
      return homeIcon;
    case "job":
      return jobIcon;
    case "park":
      return parkIcon;
    default:
      return defaultIcon;
  }
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("tr", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const getStatus = (status) => {
  switch (status) {
    case "visit":
      return "Ziyaret";

    case "park":
      return "Park Yeri";

    case "home":
      return "Ev";

    case "job":
      return "İş";

    default:
      "Tanımsız";
  }
};

export const statusObj = {
  visit: "Ziyaret",
  park: "Park yeri",
  home: "Ev",
  job: "İş",
};
