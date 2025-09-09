import { useEffect, useState } from "react";

export default function CurrentTime() {
    const [ value, setValue ] = useState<Date | null>(null);
    const [ isLoading, setLoading ] = useState(true);

    useEffect(() => {
        if (!!value) {
            setLoading(false);
        }
        const interval = setInterval(() => {
            setValue(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return { currentTime: value, isLoading };
}