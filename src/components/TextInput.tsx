interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextInput({ value, onChange }: TextInputProps) {
  return (
    <div className="text-input-section">
      <h3>Or describe the food</h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. 'grilled chicken shawarma with hummus and flatbread' or 'Oatly oat milk barista edition'"
      />
    </div>
  );
}
