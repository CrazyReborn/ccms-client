import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  firstName: string,
  role: string,
  organization: string,
  token: string,
}

const initialState = {
  firstName: '',
  role: '',
  organization: '',
  token: '',
} as UserState;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeFirstName(state, action: PayloadAction<string>) {
      return {
        ...state,
        firstName: action.payload,
      }
    },
    changeRole(state, action: PayloadAction<string>) {
      return {
        ...state,
        role: action.payload,
      }
    },
    changeOrganization(state, action: PayloadAction<string>) {
      return {
        ...state,
        organization: action.payload,
      }
    },
    changeToken(state, action: PayloadAction<string>) {
      return {
        ...state,
        token: action.payload,
      }
    },
  }
})

export const {
  changeFirstName,
  changeOrganization,
  changeRole,
  changeToken,
} = userSlice.actions;

export default userSlice.reducer;