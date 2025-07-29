import "@/app/global.css";
import { ButtonDotlists } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { Chrome, Github } from "lucide-react";
import { View } from "react-native";

export function SignIn() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();

  return (
    <View className="flex flex-col items-center justify-center bg-background">
      {!isLoading && !isAuthenticated && (
        <View className="flex flex-col gap-4 w-full">
          <ButtonDotlists 
            onClick={() => void signIn("github")}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-lg flex items-center justify-center gap-3 text-lg font-medium transition-colors font-sans"
          >
            <Github size={24} />
            continue with github
          </ButtonDotlists>
          <ButtonDotlists 
            onClick={() => void signIn("google")}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-lg flex items-center justify-center gap-3 text-lg font-medium transition-colors font-sans"
          >
            <Chrome size={24} />
            continue with google
          </ButtonDotlists>
        </View>
      )}
    </View>
  );
}