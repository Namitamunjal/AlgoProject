import beaker as bk
import pyteal as pt

class MyState:
    # Define the Application state variables
    user_signed_up = bk.GlobalStateValue(stack_type=pt.TealType.uint64, default=pt.Int(0))
    last_login_time = bk.GlobalStateValue(stack_type=pt.TealType.uint64)
    last_logout_time = bk.GlobalStateValue(stack_type=pt.TealType.uint64)
    alerts_count = bk.GlobalStateValue(stack_type=pt.TealType.uint64, default=pt.Int(0))
    data_count = bk.GlobalStateValue(stack_type=pt.TealType.uint64, default=pt.Int(0))

app = bk.Application("GreenGauge", state=MyState())

# Define the smart contract logic
@app.external
def signup(user_data: pt.abi.String):
    return pt.Seq([
        MyState.user_signed_up.set(pt.Int(1)),  # Set the signup status
        pt.Log(pt.Concat(pt.Bytes("Signup User Data: "), user_data.get())),  # Log user data for signup
        pt.Approve()
    ])

@app.external
def signin(user_data: pt.abi.String):
    return pt.Seq([
        pt.Assert(MyState.user_signed_up == pt.Int(1)),  # Ensure user is signed up
        MyState.last_login_time.set(pt.Global.latest_timestamp()),  # Update login timestamp
        pt.Log(pt.Concat(pt.Bytes("Signin User Data: "), user_data.get())),  # Log user data for signin
        pt.Approve()
    ])

@app.external
def logout(user_data: pt.abi.String):
    return pt.Seq([
        pt.Assert(MyState.user_signed_up == pt.Int(1)),  # Ensure user is signed up
        MyState.last_logout_time.set(pt.Global.latest_timestamp()),  # Update logout timestamp
        pt.Log(pt.Concat(pt.Bytes("Logout User Data: "), user_data.get())),  # Log user data for logout
        pt.Approve()
    ])

@app.external
def record_alert(user_data: pt.abi.String):
    return pt.Seq([
        MyState.alerts_count.set(MyState.alerts_count + pt.Int(1)),  # Increment alert count
        pt.Log(pt.Concat(pt.Bytes("Alert Data: "), user_data.get())),  # Log user data for alert
        pt.Approve()
    ])

@app.external
def record_data(dataType: pt.abi.String, user_data: pt.abi.String):
    return pt.Seq([
        MyState.data_count.set(MyState.data_count + pt.Int(1)),  # Increment data count
        pt.Log(pt.Concat(pt.Bytes("Data Type: "), dataType.get(), pt.Bytes(", User Data: "), user_data.get())),  # Log user data for data
        pt.Approve()
    ])

# Compile and create the app
if __name__ == "__main__":
    spec = app.build()
    spec.export("artifacts")
