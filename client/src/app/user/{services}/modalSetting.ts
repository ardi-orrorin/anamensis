export const bodyScrollToggle = (auto: boolean, on?: boolean | undefined) => {
    if(auto) {
        return document.body.style.overflow === 'hidden'
             ? document.body.style.overflow = 'auto'
             : document.body.style.overflow = 'hidden';
    } else {
        return on
             ? document.body.style.overflow = 'auto'
             : document.body.style.overflow = 'hidden';
    }

}

