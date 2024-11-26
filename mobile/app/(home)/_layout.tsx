import { ThemedView } from "@/components/ui/ThemedView";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ThemedView>
            {children}
        </ThemedView>
    )
} 