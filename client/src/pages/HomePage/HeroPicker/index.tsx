import { FC, useCallback, useEffect, useState } from "react";
import Select from "react-select";

const findHero = (option: Option, heroes: Hero[]): Hero | undefined => {
  return heroes.find((heroe) => heroe.code === option.value);
};

const HeroPicker: FC<{
  onHeroPicked: (hero: Hero) => void;
  disabled: boolean;
  heroes: Hero[];
  loading: boolean;
}> = ({ onHeroPicked, disabled, heroes, loading }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const handleChange = useCallback(
    (newValue: Option | null) => {
      if (!newValue) return;
      setOptions(options.filter((o) => o.value !== newValue.value));
      onHeroPicked(findHero(newValue, heroes)!);
    },
    [onHeroPicked, heroes, setOptions, options]
  );
  useEffect(() => {
    setOptions(heroes.map((h) => ({ label: h.name, value: h.code })));
  }, [heroes]);
  return (
    <Select
      placeholder="Select the next hero"
      isLoading={loading}
      options={options}
      onChange={handleChange}
      value={null}
      isClearable={false}
      isDisabled={disabled}
    />
  );
};

export default HeroPicker;
