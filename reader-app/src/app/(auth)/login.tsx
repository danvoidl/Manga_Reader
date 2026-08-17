import { useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Icon from "@react-native-vector-icons/material-design-icons";
import AppText from "@/components/AppText";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/store/AuthContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const scrollRef = useRef<ScrollView>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    username.trim() && password && clientId.trim() && clientSecret;

  async function handleSubmit() {
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await login({
        username: username.trim(),
        password,
        clientId: clientId.trim(),
        clientSecret: clientSecret.trim(),
      });
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 " edges={["top"]}>
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        className="px-6 flex-grow"
      >
        <KeyboardAwareScrollView style={{ flex: 1 }} bottomOffset={62}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            className="mb-8"
            accessibilityLabel="Voltar"
          >
            <Icon name="arrow-left" size={26} color="#AD89FF" />
          </Pressable>

          <AppText text="Entrar" size="title" className="mb-1" />
          <AppText
            text="Use as credenciais da sua conta MangaDex e do seu client pessoal."
            size="sub"
            className="mb-8 text-white/60"
          />

          <View className="gap-5">
            <Input
              label="Usuário"
              value={username}
              onChangeText={setUsername}
              placeholder="Seu usuário MangaDex"
              textContentType="username"
            />

            <Input
              label="Senha"
              secret
              value={password}
              onChangeText={setPassword}
              placeholder="********"
              textContentType="password"
            />

            <Input
              label="Client ID"
              value={clientId}
              onChangeText={setClientId}
              placeholder="personal-client-..."
              autoCapitalize="none"
            />

            <Input
              label="Client Secret"
              secret
              value={clientSecret}
              onChangeText={setClientSecret}
              placeholder="Seu client secret"
              onFocus={() =>
                setTimeout(
                  () => scrollRef.current?.scrollToEnd({ animated: true }),
                  100,
                )
              }
              rightAccessory={
                <Pressable
                  onPress={() => router.push("/login-help")}
                  hitSlop={10}
                  className="flex-row items-center gap-1"
                  accessibilityLabel="Como obter meu secret"
                >
                  <Icon name="information-outline" size={16} color="#AD89FF" />
                  <AppText
                    text="Como obter?"
                    size="xs"
                    className="text-callout"
                  />
                </Pressable>
              }
            />
          </View>

          {error ? (
            <AppText text={error} size="sub" className="mt-5 text-red-400" />
          ) : null}

          <Button
            title="Entrar"
            onPress={handleSubmit}
            loading={submitting}
            disabled={!canSubmit}
            className="mt-8"
          />

          <View className="mt-5 flex-row items-center justify-center gap-1">
            <Icon name="lock-outline" size={14} color="#FFFFFF80" />
            <AppText
              text="Seus dados ficam salvos apenas neste aparelho."
              size="xs"
              className="text-white/50"
            />
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}
