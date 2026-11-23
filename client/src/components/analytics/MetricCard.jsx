export default function MetricCard({
    label,
    value,
    suffix = "",
}){
    return(
        <div className="rounded-3xl border bg-white p-5">
            <p className="text-sm text-neutral-500">{label}</p>
            <p className="mt-2 text-3xl font-black">
                {value}
                {suffix}
            </p>
        </div>
    )
}