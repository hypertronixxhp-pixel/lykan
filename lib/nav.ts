/** The minimum the client-side menus need to link to a service page; keeps the full services data out of the browser bundle. */
export type ServiceLink = { slug: string; name: string };

export const nav: [label: string, href: string][] = [
  ["Services", "/services"],
  ["Work", "/work"],
  ["Solutions", "/solutions"],
  ["Approach", "/approach"],
  ["About", "/about"],
  ["Contact", "/contact"],
];
