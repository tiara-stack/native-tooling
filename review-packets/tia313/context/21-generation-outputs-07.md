# Generated module family connections

O1 is the marker, O2 the provider API/module facade, O3 its canonical backport, and O4 an explicit compatibility bridge. G1 emits these from G2/G3/G4 policy and G5 pinned compiler/config state. Provider facades feed the compiler and tsgolint; canonical backports feed the Effect service. See consumer packets30-34. All215 output identities are enumerated, including unchanged outputs.

## Family `vfs/osvfs`

`_backport/vfs/osvfs/go.mod` O3; mode `100644`, blob `5f0283c3cb1d4f9230f49cde967bb4d737f86dd8`, SHA256 `dff35f1817edf38becbde6589814a8d02d450ce767ae4b177bc500183a78cd86`.

Paired provider `native/effect-tsgo/shim/vfs/osvfs/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/vfs/osvfs

go 1.26

require github.com/microsoft/typescript-go/shim/vfs/osvfs v0.0.0
```

`_backport/vfs/osvfs/shim.go` O3; mode `100644`, blob `a5d90be062428df94b716f30e77a2a6fe058c604`, SHA256 `bcb85aad586c729e5de5e37828f5ae480295908d4201318185686021006d87ad`.

Paired provider `native/effect-tsgo/shim/vfs/osvfs/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`vfs/osvfs/go.mod` O2; mode `100644`, blob `9e7bee223576123285c51fcca014953671b56981`, SHA256 `d03036b7f28d855e76c64dca93a1c85f078a12afedec4adfddd8d9a8695219a4`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/vfs/osvfs/go.mod` is byte-identical and uses this provider interface.

```go
module github.com/microsoft/typescript-go/shim/vfs/osvfs

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`vfs/osvfs/shim.go` O2; mode `100644`, blob `353279305de861f9a9a54f96dc076229f72b84c9`, SHA256 `787bfeed4c0770f3e68b9702d5e95fbbb01cbd743862a3c898c32e7ba96204ca`.

Tsgolint mirror `native/tsgolint-effect-fork/shim/vfs/osvfs/shim.go` is byte-identical and uses this provider interface.

Provider has 2 top-level declaration lines and 2 linkname declarations. Relevant package/import and API anchors:

```go
package osvfs
import "github.com/microsoft/typescript-go/internal/vfs"
import _ "github.com/microsoft/typescript-go/internal/vfs/osvfs"
import _ "unsafe"
func FS() vfs.FS
func GetGlobalTypingsCacheLocation() string
```

## Family `vfs/vfstest`

`_backport/vfs/vfstest/go.mod` O3; mode `100644`, blob `9efb8e1067e3b9f6b66ee82d30f447eb31d9e24b`, SHA256 `1d5c48c4d6930523ea3f035a07eea9bcf8b368ee0a098e0c56f65c639c98ff96`.

Paired provider `native/effect-tsgo/shim/vfs/vfstest/go.mod`; reconstruction using exact generateBackport module template: `true`.

```go
module github.com/microsoft/TypeScript/tsc/shim/vfs/vfstest

go 1.26

require github.com/microsoft/typescript-go/shim/vfs/vfstest v0.0.0
```

`_backport/vfs/vfstest/shim.go` O3; mode `100644`, blob `def300ef67d5df26c6c937461e5783c2bcdeef79`, SHA256 `383ebd33a65e982dfc1c5e816b7b9d03f5da518d9cbbaad354140d845411ff9c`.

Paired provider `native/effect-tsgo/shim/vfs/vfstest/shim.go`; reconstruction using provider import-path-only rewrite internal/ to shim/, then Go formatting; linkname targets preserved: `true`.

`vfs/vfstest/go.mod` O2; mode `100644`, blob `0a4a792a32c3625176a594315925c2cfd5364797`, SHA256 `842cd1738490686d600dcb23bebed1a064bd658daafd8c6955d5508e653477a4`.

```go
module github.com/microsoft/typescript-go/shim/vfs/vfstest

go 1.26

require github.com/microsoft/typescript-go v0.0.0
```

`vfs/vfstest/shim.go` O2; mode `100644`, blob `db73644873e23511be6c2e8608061bc4f02e7d70`, SHA256 `f8447ab50d562866bcd3bf5a2fb90bf2fb638520749877785026621a2b14616b`.

Provider has 2 top-level declaration lines and 0 linkname declarations. Relevant package/import and API anchors:

```go
package vfstest
import (
func FromMap(m map[string]any, useCaseSensitiveFileNames bool) vfs.FS {
var Symlink = vfstest.Symlink
```
