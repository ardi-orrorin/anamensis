const ModalBackground = ({
    isOpen,
}:{
    isOpen: boolean,
}) => {
    return (
        <>
            {
                isOpen &&
                <div className={['z-10 absolute left-0 top-0 w-full min-h-screen bg-gray-500 opacity-25'].join(' ')} />
            }
        </>
    )
}

export default ModalBackground;