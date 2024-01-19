function addFavicon(config, link) {
    
    const img = document.createElement("img");
    img.src = getFaviconUrl(config, link);
    img.className = "icon-link";
    img.width = 16;
    img.height = 16;
    
    const wrapper = document.createElement("span");
    wrapper.style.whiteSpace = "nowrap";
            
    link.parentNode.insertBefore(wrapper, link);
    wrapper.appendChild(link);
    link.parentNode.insertBefore(img, link);
    
    if (config.openInNewWindow) {
        link.target = "_blank";
        link.rel = "noopener";
    }
}

function getFaviconUrl(config, link) {

    const hostname = link.hostname.toLowerCase();

    for (const [key, value] of Object.entries(config.icons)) {
        if (hostname.includes(key)) {
            
            if (config.iconsPath.substr(-1) != '/')
                config.iconsPath = config.iconsPath + '/';

            return config.iconsPath + value;
        }
    }

    return `https://www.google.com/s2/favicons?domain=${link.href}&sz=16`;
}

function addFavicons(config) {

    var links = document.querySelectorAll('.md-content a[href*="://"]');
    for (const link of links) {
        if (!config.excludes.some(x => link.href.startsWith(x))) {
            addFavicon(config, link);
        }
    }
}

if (typeof document$ !== "undefined") {
    document$.subscribe(function () {        
        addFavicons(faviconsConfig);
    })
}