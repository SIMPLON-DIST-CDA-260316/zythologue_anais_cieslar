import {Button} from "@/components/ui/button.tsx";
import {useAuth} from "@/contexts/auth-context.tsx";

export default function DashboardPage() {
    const {logout} = useAuth();
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p>Tu es connectée 🍺</p>

            <Button onClick={logout}>Logout</Button>
        </div>
    )
}