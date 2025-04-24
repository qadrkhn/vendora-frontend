type Props = {
    className?: string;
}

export default function LoaderRipple({ className = '' }: Props) {
    return (
        <div className={`flex justify-center items-center ${className}`}>
        <div className={`animate-ping ${className} border-4 border-blue-500 rounded-full opacity-75`} />
        </div>
    );
}
