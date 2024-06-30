import React from 'react';
import LightGallery from 'lightgallery/react';
// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
// import plugins if you need
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

export default function Gallery({ imgs }) {
    const onInit = () => {
        console.log('lightGallery has been initialized');
    };

    return (
        <div className="gallery">
            <LightGallery
                onInit={onInit}
                speed={500}
                plugins={[lgThumbnail, lgZoom]}
            >
                {imgs.map((img, index) => (
                    <a className='gallery-link' href={require (`../imgs/${img}`)} key={index}>
                        <img className='gallery-img' alt={`img${index + 1}`} src={require (`../imgs/${img}`)} />
                    </a>
                ))}
            </LightGallery>
        </div>
    );
}
