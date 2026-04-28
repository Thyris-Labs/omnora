import { apiErrorMessage, client } from "lib/api";
import type { UpdateUserDataPayload } from "features/settings/schemas";
import { auth } from "features/auth/store.svelte";

class SettingsStore {
  isOpen = $state(false);
  avatarUploading = $state(false);
  errorMessage = $state<string | null>(null);
  errorTimeout: ReturnType<typeof setTimeout> | null = null;

  openSettings() {
    this.isOpen = true;
  }

  clearError() {
    if (this.errorTimeout) clearTimeout(this.errorTimeout);
    this.errorTimeout = null;
    this.errorMessage = null;
  }

  setError(message: string) {
    this.clearError();
    this.errorMessage = message;
    this.errorTimeout = setTimeout(() => {
      this.errorMessage = null;
      this.errorTimeout = null;
    }, 2000);
  }

  async saveAccountData(body: UpdateUserDataPayload) {
    this.clearError();

    const [, error] = await client.patch("/api/v1/users/edit", { body }).safe();

    if (error) {
      this.setError(apiErrorMessage(error));
      console.error(error);
      return false;
    }

    if (!auth.userData) return false;
    auth.userData = {
      ...auth.userData,
      displayName: body.displayName,
      username: body.username,
    };

    return true;
  }

  async updateAvatar(avatar: File) {
    this.avatarUploading = true;
    this.clearError();

    const formData = new FormData();
    formData.append("avatar", avatar);

    const [body, error] = await client.patch("/api/v1/users/avatar", { body: formData }).safe();

    this.avatarUploading = false;

    if (error) {
      this.setError(apiErrorMessage(error));
      console.error(error);
      return false;
    }

    if (!auth.userData) {
      this.setError("Your session is not ready. Please try again.");
      return false;
    }

    auth.userData = {
      ...auth.userData,
      avatar: body.avatarUrl,
    };

    return true;
  }
}

export const settings = new SettingsStore();
