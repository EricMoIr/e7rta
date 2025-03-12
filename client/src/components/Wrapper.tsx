import { ElementType, FC, PropsWithChildren } from "react";

const ConditionalWrapper: FC<
  PropsWithChildren<{ condition: boolean; wrapper: ElementType }>
> = ({ condition, wrapper: Wrapper, children }) => {
  if (condition) {
    return <Wrapper>{children}</Wrapper>;
  }
  return children;
};

export default ConditionalWrapper;
