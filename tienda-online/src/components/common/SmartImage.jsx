export default function SmartImage({ src, alt, className }) {
    const PLACEHOLDER = 'https://placehold.co/400x300?text=Sin+Imagen';

    return (
        <img
            src={src || PLACEHOLDER}
            alt={alt}
            className={`${className} object-contain object-center`}
            onError={(e) => { e.target.src = PLACEHOLDER }}
        />
    );
}
