// src/components/LandingPage.tsx
import { CheckSquare, GanttChartSquare, Users } from "lucide-react";
import { Image, ScrollView, Text, View } from "react-native";
import "../app/global.css";
import { SignIn } from "./auth/SignIn";

export function LandingPage() {
  return (
    <ScrollView className="min-h-screen flex flex-col bg-background text-foreground">
      <View className="p-4">
        <View className="container mx-auto flex items-center">
          <Image src="@/assets/favicon.ico" alt="logo" className="h-8 w-8 mr-2" />
          <Text className="font-bold text-xl font-heading">dotlists</Text>
        </View>
      </View>

      <View className="flex-grow">
        <View className="container mx-auto flex flex-col items-center justify-center text-center py-20">
          <Text className="text-5xl md:text-7xl font-bold font-heading mb-4">
            organize your work, effortlessly.
          </Text>
          <Text className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
            a collaborative workspace to manage tasks, track progress, and bring
            your team together. get started in seconds.
          </Text>
          <View className="w-full max-w-xs">
            <SignIn />
          </View>
        </View>

        <View id="features" className="py-20 bg-muted-50">
          <View className="container mx-auto text-center">
            <Text className="text-4xl font-bold font-heading mb-12">
              everything you need to get work done
            </Text>
            <View className="grid md:grid-cols-3 gap-12">
              <View className="flex flex-col items-center">
                <GanttChartSquare className="h-12 w-12 mb-4 text-primary" />
                <Text className="text-2xl font-bold font-heading mb-2">
                  visual project planning
                </Text>
                <Text className="text-muted-foreground">
                  plan and track your projects with our intuitive gantt charts.
                  visualize timelines, dependencies, and progress at a glance.
                </Text>
              </View>
              <View className="flex flex-col items-center">
                <CheckSquare className="h-12 w-12 mb-4 text-primary" />
                <Text className="text-2xl font-bold font-heading mb-2">
                  detailed task management
                </Text>
                <Text className="text-muted-foreground">
                  break down large tasks into manageable subtasks. track the
                  status of every detail to ensure nothing falls through the
                  cracks.
                </Text>
              </View>
              <View className="flex flex-col items-center">
                <Users className="h-12 w-12 mb-4 text-primary" />
                <Text className="text-2xl font-bold font-heading mb-2">
                  seamless collaboration
                </Text>
                <Text className="text-muted-foreground">
                  work with your team in real-time. assign tasks, leave
                  comments, and get notifications to keep everyone in sync.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View id="about" className="py-20">
          <View className="container mx-auto text-center">
            <Text className="text-4xl font-bold font-heading mb-12">
              about us
            </Text>
            <View className="max-w-3xl mx-auto">
              <Text className="text-muted-foreground mb-4">
                the original idea for dotlib came from us looking for team management tools, all of them required you to pay for basic features, which is hard to afford for small teams. we wanted to create a tool that is free, open source, and easy to use which could help teams of all sizes to manage their work effectively and simply. 
              </Text>
              <Text className="text-muted-foreground">
                our development team is composed of students who all met through VEX robotics, and we're passionate about building tools that make work easier and more enjoyable. we believe in the power of collaboration and open source, and we're excited to share dotlib with the world for free.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="p-4">
        <Text className="container mx-auto text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} dotlib. all rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}
