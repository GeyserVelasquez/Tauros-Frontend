export function AppTitle() {
    return (
        <>
            {/* Texto semántico puro para SEO y accesibilidad */}
            <span className="sr-only">TAUROS</span>
                <span aria-hidden="true">
                    T
                    <span className="inline-block rotate-90 w-[0.8em] text-center -ml-[0.05em] mr-[0.05em] select-none]">
                      𐤀
                    </span>
                    UROS
            </span>
        </>
    );
}