#!/system/bin/sh
# Magisk late_start boot script for chroot-distro Debian (Termux).
# Runs one persistent chroot session; no supervisor / automatic restart.

(
    P=/data/data/com.termux/files/usr
    H=/data/data/com.termux/files/home
    ROOTFS="$P/var/lib/chroot-distro/containers/debian/rootfs"

    # Magisk does not start with a Termux environment.
    export PREFIX="$P"
    export TERMUX__PREFIX="$P"
    export TERMUX__HOME="$H"
    export TERMUX_APP__PACKAGE_NAME=com.termux
    export TERMUX_VERSION=1
    export HOME="$H"
    export PATH="$P/bin:/system/bin:/system/xbin"
    export TMPDIR="$P/tmp"
    unset LD_PRELOAD LD_LIBRARY_PATH PYTHONHOME PYTHONPATH

    echo "$(date): Waiting for Android boot and Debian rootfs"
    until [ "$(getprop sys.boot_completed)" = "1" ] && [ -f "$ROOTFS/etc/os-release" ]; do
        sleep 10
    done

    if [ ! -x "$P/bin/chroot-distro" ]; then
        echo "$(date): ERROR: chroot-distro not found at $P/bin/chroot-distro"
        exit 1
    fi

    mkdir -p "$P/tmp"
    cd "$H" || exit 1
    echo "$(date): Starting Debian chroot session"
    "$P/bin/chroot-distro" login debian -- /bin/sleep infinity
    rc=$?
    echo "$(date): Debian chroot session exited (code $rc)"
) >> /data/adb/debian-start.log 2>&1 &
