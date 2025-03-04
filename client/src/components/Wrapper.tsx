import React, { ElementType, FC, PropsWithChildren } from 'react';

const ConditionalWrapper: FC<PropsWithChildren<{ condition: boolean, wrapper: ElementType }>> = ({ condition, wrapper: Wrapper, children}) => {
  if (condition) {
    <Wrapper>
      {children}
    </Wrapper>
  }
  return children
}

export default ConditionalWrapper;