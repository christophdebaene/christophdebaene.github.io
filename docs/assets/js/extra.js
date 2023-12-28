const excludes = [
    'https://github.com/christophdebaene/christophdebaene.github.io',
    'https://twitter.com/ChrisDeBaene',
    'https://github.com/christophdebaene'
];

function iconlink()
{
    const links = document.getElementsByTagName("a");
            
    for (const link of links) {
                        
        const href = link.getAttribute("href");
        if (href && href.startsWith("http") && link.hostname !== location.hostname && !excludes.includes(href))
        {                           
            link.target = "_blank";
            link.rel = "noopener";
            
            const img = document.createElement("img");
            img.src = "https://www.google.com/s2/favicons?domain=" + href;
            img.className = "iconlink";
            img.width = 16;
            img.height = 16;
            
            link.parentNode.insertBefore(img, link);
        }
    }
}

window.addEventListener("DOMContentLoaded", function() {
    iconlink();    
});