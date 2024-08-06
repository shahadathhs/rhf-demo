import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
// import { useEffect } from "react";

type FormValues = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  },
  phoneNumbers: string[],
  phNumbers: {
    number: string;
  }[],
  age: number;
  dob: Date
}

export default function YoutubeForm() {
  const form = useForm<FormValues>({
    // defaultValues: async () => {
    //   const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
    //   const data = await response.json();
    //   return {
    //     username: "Batman",
    //     email: data.email,
    //     channel: "DC"
    //   }
    // }
    defaultValues: {
      username: "",
      email: "",
      channel: "",
      social: {
        twitter: "",
        facebook: ""
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: "" }],
      age: 0,
      dob: new Date()
    },
    mode: "all"
  });

  const {
    register, control, handleSubmit, formState,
    watch, getValues, setValue, reset, trigger
  } = form;

  const { 
    errors, touchedFields, dirtyFields, isDirty, isValid,
    isSubmitting, isSubmitted, isSubmitSuccessful, submitCount
  } = formState;

  console.log({ isSubmitting, isSubmitted, isSubmitSuccessful, submitCount })
  console.log({ touchedFields, dirtyFields, isDirty, isValid })

  const { fields, append, remove } = useFieldArray({
    name: 'phNumbers',
    control,
  })

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // reset();
  }

  const onError = (error: FieldErrors<FormValues>) => {
    console.log("Form Error", error);
    // reset();
  }

  const handleGetValues = () => {
    console.log(getValues());
  }

  const handleSetValues = () => {
    setValue("username", "");
    // setValue("email", "9nXxP@example.com");
  }

  // useEffect(()=> {
  //   if (isSubmitSuccessful) {
  //     reset()
  //   }
  // }, [isSubmitSuccessful, reset])

  // useEffect(() => {
  //   const subscription = watch((value) => {
  //     console.log(value);
  //   });

  //   return () => subscription.unsubscribe();
  // }, [watch]);

  // const watchForm = watch()

  return (
    <div>
      <h3>Youtube Form</h3>
      {/* <h2>Watched value: {JSON.stringify(watchForm)}</h2> */}
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px", width: "300px"
        }}
        onSubmit={(handleSubmit(onSubmit, onError))} noValidate
      >


        <label htmlFor="username">Username</label>
        <input type="text" id="username"
          {...register("username", {
            required: { value: true, message: "Username is required" },
          })}
        />
        <span style={{ color: "red" }}>{errors.username?.message}</span>

        <label htmlFor="email">Email</label>
        <input type="email" id="email"
          {...register("email", {
            pattern:
            {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            },
            required: "Email is required",
            validate: {
              notAdmin: (fieldValue) => {
                return fieldValue !== "admin@example.com" ||
                  "Enter a different email address"
              },
              notBlackListed: (fieldValue) => {
                return !fieldValue.endsWith("bad.com") ||
                  "This domain is not allowed"
              },
              emailAvailable: async (fieldValue) => {
                const response = await fetch(`https://jsonplaceholder.typicode.com/users?email=${fieldValue}`);
                const data = await response.json();
                return data.length == 0 || "Email already exists"
              }
            }
          })}
        />
        <span style={{ color: "red" }}>{errors.email?.message}</span>

        <label htmlFor="channel">Channel</label>
        <input type="text" id="channel"
          {...register("channel", {
            required: { value: true, message: "Channel is required" },
          })}
        />
        <span style={{ color: "red" }}>{errors.channel?.message}</span>

        <label htmlFor="twitter">Twitter</label>
        <input type="text" id="twitter"
          {...register("social.twitter", {
            disabled: watch("channel") === "",
            required: "Enter Twitter Profile"
          })}
        />

        <label htmlFor="facebook">Facebook</label>
        <input type="text" id="facebook"
          {...register("social.facebook")}
        />

        <label htmlFor="primary-phone">Primary Phone</label>
        <input type="text" id="primary-phone"
          {...register("phoneNumbers.0")}
        />

        <label htmlFor="secondary-phone">Secondary Phone</label>
        <input type="text" id="secondary-phone"
          {...register("phoneNumbers.1")}
        />

        <label htmlFor="phNumbers">Phone Numbers</label>
        {
          fields.map((item, index) => (
            <div key={item.id}>
              <input
                type="text"
                {...register(`phNumbers.${index}.number` as const)}
              />
              {
                index > 0 &&
                <button type="button"
                  onClick={() => remove(index)}>
                  Remove
                </button>
              }
            </div>
          ))
        }
        <button type="button" onClick={() => append({ number: "" })}>
          Add Phone Number
        </button>

        <label htmlFor="age">Age</label>
        <input type="number" id="age"
          {...register("age",
            {
              valueAsNumber: true,
              required: { value: true, message: "Age is required" },
            })}
        />
        <span style={{ color: "red" }}>{errors.age?.message}</span>

        <label htmlFor="dob">Date of Birth</label>
        <input type="date" id="dob"
          {...register("dob",
            {
              valueAsDate: true,
              required: { value: true, message: "Date of birth is required" },
            })}
        />
        <span style={{ color: "red" }}>{errors.dob?.message}</span>
        
        {/* <button disabled={!isDirty || isSubmitting} type="submit">Submit</button> */}
        <button disabled={!isDirty || !isValid || isSubmitting} type="submit">Submit</button>
        <button onClick={handleGetValues}>Get Values</button>
        <button onClick={handleSetValues}>Set Value</button>
        <button onClick={() => trigger("email")}>Validate</button>
        <button onClick={() => reset()}>Re Set</button>
      </form>
      <DevTool control={control} />
    </div>
  )
}
